FROM python:3.7
RUN mkdir /backend
WORKDIR /backend
ENV FLASK_APP=run.py
COPY requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt