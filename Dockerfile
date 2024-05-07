FROM node:20.12.2-alpine 
WORKDIR /app
COPY ./package.json ./package.json
COPY ./prisma ./prisma
COPY ./src ./src
COPY ./nest-cli.json ./nest-cli.json
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json