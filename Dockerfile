FROM mhart/alpine-node:latest

LABEL authors="ollelauribostrom"

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# Set environment variables
ENV PORT 80
ENV DBADRESS mongodb://mongodb:27017/avocado
ENV PREFIX /api/v1
ENV NODE_ENV production

# expose the port to outside world
EXPOSE 80

# start command as per package.json
CMD MONGO_HOST="mongodb" npm start
