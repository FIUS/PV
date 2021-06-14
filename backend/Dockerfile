FROM python:3.8-buster

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN cd nextcloud-API
RUN python setup.py install
RUN cd ..

CMD [ "python", "./main.py" ]