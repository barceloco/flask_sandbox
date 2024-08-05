ARG OWNER=exnada
ARG BASE_CONTAINER=debian:11.1-slim

FROM $BASE_CONTAINER
LABEL maintainer="ExNada Inc. <info@exnada.com>"

ARG EXNADA_USER="exnada"
ARG EXNADA_UID="1000"
ARG EXNADA_GID="100"

ARG APT_GET_PACKAGES="packages.txt"
ARG PYTHON_REQUIREMENTS="requirements.txt"

USER root
RUN rm -f /usr/local/bin/python
COPY ${APT_GET_PACKAGES} /tmp/
RUN apt-get update \
 && xargs --arg-file /tmp/${APT_GET_PACKAGES} --no-run-if-empty apt-get install -y \
 && apt-get clean \
 && rm -f /tmp/${APT_GET_PACKAGES} \
 && rm -rf /var/lib/apt/lists/* \
 && ln -s /usr/bin/python3.9 /usr/local/bin/python

COPY ${PYTHON_REQUIREMENTS} /tmp/
RUN python3.9 -m pip install --no-cache-dir --upgrade pip \
 && python3.9 -m pip install --no-cache-dir -r /tmp/${PYTHON_REQUIREMENTS} \
 && rm -f /tmp/${PYTHON_REQUIREMENTS}

RUN useradd -l -m -s /bin/bash -N -u "${EXNADA_UID}" -g ${EXNADA_GID} "${EXNADA_USER}" \
 && chmod g+w /etc/passwd

COPY app.py /app/

USER ${EXNADA_USER}
ENV HOME="/home/${EXNADA_USER}"
WORKDIR ${HOME}

CMD ["python3", "-m", "flask", "--app", "/app/app.py", "run", "--host=0.0.0.0"]
