FROM node:lts-alpine

RUN mkdir -p /app && \
    chown node:node /app && \
    npm install -g serve

USER node

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./

RUN npm run build 

# start app
CMD ["serve", "-s", "build", "-l", "8080"]