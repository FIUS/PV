import threading
import traceback
from datetime import datetime


class SyncManager:
    """
    Makes sure only one Sync runs at a time and remembers the outcome of
    the last one, so the admin interface can poll its status.
    """

    def __init__(self, app, queries) -> None:
        self.app = app
        self.queries = queries
        self._sync_lock = threading.Lock()
        self._state_lock = threading.Lock()
        self._status = {
            "running": False,
            "runId": 0,
            "result": None,
            "error": None,
            "finishedAt": None,
        }

    def status(self) -> dict:
        with self._state_lock:
            return dict(self._status)

    def start_manual(self) -> bool:
        """
        Starts a single-attempt Sync in a background thread.
        Returns False if a Sync is already running.
        """
        if not self._sync_lock.acquire(blocking=False):
            return False
        self._begin()
        threading.Thread(target=self._run_manual, daemon=True).start()
        return True

    def run_scheduled(self) -> None:
        """
        Runs the retrying Sync in the calling thread (used by the TaskScheduler).
        Waits if a manual Sync is currently running.
        """
        with self._sync_lock:
            self._begin()
            try:
                self._finish(result=self.queries.create_Links())
            except Exception as e:
                traceback.print_exc()
                self._finish(error=str(e) or e.__class__.__name__)

    def _run_manual(self) -> None:
        try:
            with self.app.app_context():
                result = self.queries.sync_once(fail_fast=True)
            self._finish(result=result)
        except Exception as e:
            traceback.print_exc()
            self._finish(error=str(e) or e.__class__.__name__)
        finally:
            self._sync_lock.release()

    def _begin(self) -> None:
        with self._state_lock:
            self._status["running"] = True
            self._status["runId"] += 1
            self._status["result"] = None
            self._status["error"] = None

    def _finish(self, result=None, error=None) -> None:
        with self._state_lock:
            self._status["running"] = False
            self._status["result"] = result
            self._status["error"] = error
            self._status["finishedAt"] = datetime.now().strftime(
                '%Y-%m-%dT%H:%M:%SZ')
