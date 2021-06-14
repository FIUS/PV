FROM python:3.8-buster

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python ./nextcloud-API/setup.py install

CMD [ "python", "./main.py" ]