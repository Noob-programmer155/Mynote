FROM gradle:7.6-jdk17 AS BUILD_CONTAINER
ENV HOME=/home/gradle
COPY --chown=gradle:gradle . ${HOME}
RUN gradle clean build || return 1

FROM openjdk:17-alpine
ENV APP_NAME=Application-1.0.jar
ENV BUILD_FOLDER=Application/build/libs/
ENV _WORKDIR=/home/docker/backend

COPY --from=BUILD_CONTAINER /home/gradle/${BUILD_FOLDER}/${APP_NAME} ${_WORKDIR}/
WORKDIR ${_WORKDIR}

#RUN groupadd -r -g 123 group_mynote && useradd -r -g 123 -u 1 user1 && chown -R user1:group_mynote ${_WORKDIR}
#USER user1

EXPOSE 8080

ENTRYPOINT exec java -jar ${APP_NAME}