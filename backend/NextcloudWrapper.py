from urllib.parse import unquote
from nextcloud import NextCloud
from nextcloud.base import ShareType, datetime_to_expire_date
import datetime
import threading
import time


class NextcloudWrapper:
    def __init__(self, domain, username, password, remote_directory):
        self.domain = domain
        self.username = username
        self.password = password
        self.remote_directory = remote_directory
        self.folder_cache = dict()

        self.nc = NextCloud(domain, username, password, json_output=True)

        self.last_folder_cache_refresh = datetime.datetime.fromtimestamp(0)
        self.folder_cache = self.get_lectures()

        self.link_cache = dict()
        self.is_refreshing = False
        self.refreshing_state = 0
        self.refreshing_progress = 0
        self.last_link_cache_refresh = datetime.datetime.fromtimestamp(0)
        threading.Thread(target=self.refresh_link_cache).start()

    def refresh_link_cache(self):
        print("Starting to refresh")
        self.is_refreshing = True
        for idx, folder in enumerate(self.folder_cache):
            link = self.link_from_server(folder['folder'], 14, True)
            self.link_cache[folder['folder']] = link

            self.refreshing_progress = idx/len(self.folder_cache)
            self.refreshing_state = idx

            print("Cache:", idx, "/", len(self.folder_cache))

        self.last_link_cache_refresh = datetime.datetime.now()
        self.is_refreshing = False
        print("Finished refreshing")

    def refresh_link_cache_async(self):
        if not self.is_refreshing:
            threading.Thread(target=self.refresh_link_cache).start()

    def get_lectures(self, force_refresh=False):
        if self.last_folder_cache_refresh+datetime.timedelta(hours=30) > datetime.datetime.utcnow() and not force_refresh:
            return self.folder_cache
        files = self.__get_all_files()
        lectures = self.__filter_lectures(files)
        self.folder_cache = self.__get_clean_lecture_list(lectures)
        self.last_folder_cache_refresh = datetime.datetime.utcnow()
        return self.folder_cache

    def __get_clean_lecture_list(self, lecture_list):
        output = list()
        for idx, lecture in enumerate(lecture_list):
            try:
                name = self.__fix_strings(lecture["file"][1])
                short = self.__fix_strings(lecture["file"][0])
                prof = self.__fix_strings(lecture["file"][3])
                note = "None"
                output.append({"id": idx, "name": name, "short": short,
                               "prof": prof, "note": note, "folder": lecture["folder"]})
            except:
                print("Ein bob hat das namesschema falsch gemacht:", lecture)
        return output

    def __filter_lectures(self, files):
        output_files = list()
        output_names = list()

        for file in files:
            try:
                splitted_file = file["filename"].split("#")
                if splitted_file[1] not in output_names and splitted_file[0] != "To-Check":
                    output_names.append(splitted_file[1])
                    output_files.append(
                        {"file": splitted_file, "folder": file["folder"]})
            except:
                print("Ein bob hat das namesschema falsch gemacht")

        return output_files

    def __get_all_files(self):
        output = list()
        nc_list = self.nc.list_folders(
            self.username, path=self.remote_directory, depth=2, all_properties=True).data
        for file in nc_list:
            if "content_type" in file:
                unquoted = unquote(file["href"])
                folder = unquoted.split("/")[5:-1]
                output_folder = ""
                for s in folder:
                    output_folder += "/"+s
                output_folder += "/"
                output.append(
                    {"filename": unquoted[unquoted.rfind("/")+1:], "content": file, "folder": output_folder})

        return output

    def __fix_strings(self, input: str):
        return input.replace("_", " ")

    def link_from_server(self, folder, expire_days=7, force_server_fetch=False):
        if not force_server_fetch:
            if self.last_link_cache_refresh+datetime.timedelta(days=7) > datetime.datetime.utcnow():
                return self.link_cache[folder]
            else:
                time.sleep(0.5)
                if not self.is_refreshing:
                    self.is_refreshing = True
                    threading.Thread(target=self.refresh_link_cache).start()

        expire_date = datetime_to_expire_date(
            datetime.datetime.now() + datetime.timedelta(days=expire_days))
        link = self.nc.create_share(
            folder, share_type=ShareType.PUBLIC_LINK.value)
        if link.is_ok:
            link_id = link.data['id']
            updated_link = self.nc.update_share(
                link_id, expire_date=expire_date)
            if updated_link.is_ok:
                log_data = updated_link.data

                with open('links.log', 'a') as log_file:
                    logput = str(datetime.datetime.now())+" -> "
                    logput += " id: "+log_data['id']
                    logput += " expiration: "+log_data['expiration']
                    logput += " url: "+log_data['url']
                    logput += "\n"

                    log_file.write(logput)

                return updated_link.data['url']
        return None
