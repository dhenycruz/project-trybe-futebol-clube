FROM node:16-alpine
WORKDIR /app/backend/
COPY package* ./
RUN npm install
COPY . ./
EXPOSE 3001
CMD ["npm", "start"]