FROM python:3.8-buster

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./nextcloud-API/ ./nextcloud-API/

RUN cd nextcloud-API && python setup.py install

COPY . .

CMD [ "python", "./main.py" ]