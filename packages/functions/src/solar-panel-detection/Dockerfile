FROM public.ecr.aws/lambda/python:3.11

RUN pip install --upgrade pip

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install development tools of gcc using dnf (instead of yum and apt)
    #RUN dnf install -y gcc
RUN yum install -y gcc

# Enable EPEL repository and install additional libraries
RUN yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm && \
    yum update -y && \
    yum install -y mesa-libGL ffmpeg

# Install the specified packages
RUN pip install -r requirements.txt && \
pip install --upgrade inference

# Set the ROBOFLOW_API_KEY environment variable
ENV ROBOFLOW_API_KEY="T27fjPV0GAu0JKEpMPqe"


# Copy all files in ./src
COPY src/* ${LAMBDA_TASK_ROOT}

# Set the CMD to handler
CMD [ "solarPanelDetection.lambda_handler" ]