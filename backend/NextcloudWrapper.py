from nextcloud import NextCloud
from urllib.parse import unquote


class NextcloudWrapper:
    def __init__(self, domain, username, password, remote_directory):
        self.domain = domain
        self.username = username
        self.password = password
        self.remote_directory = remote_directory

        self.nc = NextCloud(domain, username, password, json_output=True)

    def get_lectures(self):
        files = self.__get_all_files()
        lectures = self.__filter_lectures(files)
        return self.__get_clean_lecture_list(lectures)

    def __get_clean_lecture_list(self, lecture_list):
        output = list()
        for lecture in lecture_list:
            try:
                name = self.__fix_strings(lecture[1])
                short = self.__fix_strings(lecture[0])
                prof = self.__fix_strings(lecture[3])
                note = "None"
                output.append({"name": name, "short": short,
                               "prof": prof, "note": note})
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
                    output_files.append(splitted_file)
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
                output.append(
                    {"filename": unquoted[unquoted.rfind("/")+1:], "content": file})

        return output

    def __fix_strings(self, input: str):
        return input.replace("_", " ")
