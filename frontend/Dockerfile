FROM node:lts-alpine

RUN mkdir -p /app && \
    npm install -g serve

USER node


# install app dependencies
COPY package.json /app/
COPY package-lock.json /app/

USER root
RUN chown -R node:node /app
USER node

# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH


RUN npm install

# add app
COPY . ./

RUN npm run build 

# start app
CMD ["serve", "-s", "build", "-l", "8080"]