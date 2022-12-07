FROM node:17.9.0-alpine

RUN mkdir /app

# Copia os arquivos do projeto para o diretorio do app
COPY  service/ /app/

# Definindo o diretorio onde o CMD será executado e copiando o arquivo de requirements
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY service/package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 5000
CMD [ "node", "server.js" ]