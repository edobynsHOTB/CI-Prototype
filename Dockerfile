FROM node:latest
ADD package.json package.json
RUN npm install
ADD . .
EXPOSE 80
CMD ["npm", "start"]
