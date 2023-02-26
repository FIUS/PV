import requests
import datetime
import urllib.parse


class Nextcloud:
    def __init__(self, base_url, username, password):

        # Replace these values with your own
        self.base_url = base_url
        self.username = username
        self.password = password

        self.session = requests.Session()
        self.session.auth = (username, password)

    def create_link(self, folder_name, valid_for=14):

        today = datetime.date.today()
        future_date = today + datetime.timedelta(days=valid_for)

        # Create a session object to store authentication credentials

        # Construct the URL for sharing the folder
        share_url = self.base_url + "/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json"

        # Create a payload with the parameters for sharing
        payload = {
            "path": folder_name,
            "shareType": 3,  # 3 means public link share
            "expireDate": datetime.datetime.strftime(future_date, "%Y-%m-%d")
        }

        # Send a POST request to create the share
        response = self.session.post(share_url, data=payload, headers={
            "OCS-APIRequest": "true"}, timeout=5)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            # Get the share link from the response
            link = data["ocs"]["data"]["url"]
            # Print the share link
            print(f"The share link for {folder_name} is: {link}")
            return {
                "valid_until": future_date,
                "link": link
            }
        else:
            # Print an error message
            print(f"Something went wrong: {response.text}")

    def list_subfolders(self, folder_name):
        # Construct the URL for getting the list of subfolders
        subfolders_url = self.base_url + \
            f"/remote.php/dav/files/{self.username}/{folder_name}/"

        # Send a PROPFIND request to get the list of subfolders
        response = self.session.request('PROPFIND', subfolders_url, headers={
            "Depth": "1",
            "OCS-APIRequest": "true"
        }, timeout=5)

        # Check if the request was successful
        if response.status_code == 207:
            # Parse the XML response to get the list of subfolders
            subfolders = []
            xml_content = response.content
            from xml.etree import ElementTree
            root = ElementTree.fromstring(xml_content)
            for response in root.findall('{DAV:}response'):
                href = response.find('{DAV:}href').text
                subfolder_name = href.replace(
                    f"/remote.php/dav/files/{self.username}/{folder_name}/", "")
                if subfolder_name:
                    subfolder_name = subfolder_name.split(
                        '/')[-2]  # -2 because trailing /
                    subfolders.append(urllib.parse.unquote(subfolder_name))
            subfolders.remove(folder_name.split(
                '/')[-1])
            return subfolders
        else:
            # Print an error message
            print(f"Something went wrong: {response.text}")
