PROJECT_ID=sendbox-go
ZONE=us-central1-f
APP=exohub
###

create-tf-backend-bucket:
	gsutil mb -p $(PROJECT_ID) gs://$(PROJECT_ID)-terraform

###

# check the the environment a target should be run against. If undefined, raise an error
check-env:
ifndef ENV
	$(error Please set ENV=[staging|production])
endif

# This cannot be indented or else make will include spaces in front of secret
define get-secret
$(shell gcloud secrets versions access latest --secret=$(1) --project=$(PROJECT_ID))
endef

SSH_STRING=emotu@sendbox-build
OAUTH_CLIENT_ID=542106262510-8ki8hqgu7kmj2b3arjdqvcth3959kmmv.apps.googleusercontent.com

GITHUB_SHA?=latest
TAG?=s1.0.0
LOCAL_TAG=$(APP):$(TAG)
REMOTE_TAG=gcr.io/$(PROJECT_ID)/$(LOCAL_TAG)
DELETE_DEPLOYMENT?=false

CONFIG_BRANCH?=staging
ifeq ($(ENV), production)
	CONFIG_BRANCH=master
endif

test: check-env
	@echo $(CONFIG_BRANCH)

ssh: check-env
	gcloud compute ssh $(SSH_STRING) \
		--project=$(PROJECT_ID) \
		--zone=$(ZONE)

ssh-cmd: check-env
	@gcloud compute ssh $(SSH_STRING) \
		--project=$(PROJECT_ID) \
		--zone=$(ZONE) \
		--command="$(CMD)"

build:
	docker build -t $(LOCAL_TAG) .

push:
	docker tag $(LOCAL_TAG) $(REMOTE_TAG)
	docker push $(REMOTE_TAG)

# the deploy make target
deploy: check-env
	@echo "downloading deployment file..."
	- rm -rif ./files
	git clone https://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@github.com/sendbox-software-inc/sendbox-$(APP)-deployment.git files/app
	git clone https://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@github.com/sendbox-software-inc/headless-config.git --branch $(CONFIG_BRANCH) files/shared
	cp -r ./files/shared/base/* ./files/app/base/base_config
	cd ./files/app/$(ENV) && kustomize edit set image $(REMOTE_TAG) && cd ../../../
	kustomize build ./files/app/$(ENV) | tee deployment.yaml
	- if $(DELETE_DEPLOYMENT); then kubectl delete deployment sendbox-$(APP) -n $(ENV); fi
	kubectl apply -f deployment.yaml
