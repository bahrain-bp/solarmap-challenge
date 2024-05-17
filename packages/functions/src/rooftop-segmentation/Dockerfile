FROM public.ecr.aws/lambda/python:3.11

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install development tools of gcc using dnf (instead of yum and apt)
    #RUN dnf install -y gcc
RUN yum install -y gcc

# Install the specified packages
RUN pip install -r requirements.txt

# Copy all files in ./src
COPY src/* ${LAMBDA_TASK_ROOT}

# Set the CMD to handler
CMD [ "rooftopDetection.lambda_handler" ]