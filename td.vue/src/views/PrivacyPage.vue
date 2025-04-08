<template>
    <b-container fluid>
        <div class="welcome-jumbotron">
            <b-row class="text-center mb-2">
                <b-col md="12">
                    <h1 class="display-3 text-center">
                        {{ t('privacy.title') }}
                    </h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <div class="td-operator mt-5 text-left"> {{ t('operator.operatedby') }} </div>
                    <div class="td-operator mt-5 text-left"> {{ t('operator.name') }} </div>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <div class="td-description mt-5 text-left">
                        <p>{{ t('privacy.lastUpdated') }}</p>
                        <p>{{ t('privacy.introduction') }}</p>
                        <div v-for="(section, index) in t('privacy.sections')" :key="index" class="mt-4">
                            <h2>{{ section.heading }}</h2>
                            <p>{{ section.content }}</p>
                        </div>
                    </div>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="12">
                    <div class="td-contact mt-5 text-left"> {{ t('operator.contact') }} </div>
                </b-col>
            </b-row>
        </div>
    </b-container>
</template>

<script>
import { useI18n } from '@/i18n';

export default {
    name: 'PrivacyPage',
    setup() {
        const { t } = useI18n();
        
        return {
            t
        };
    }
};
</script>

<style lang="scss" scoped>
/* Recreating BootstrapVue's b-jumbotron styling */
.welcome-jumbotron {
    background-color: #f8f9fa;
    /* Light grey background like BootstrapVue jumbotron */
    padding: 3rem 2rem;
    /* Increase padding to match BootstrapVue */
    border-radius: 0.3rem;
    /* Add rounded corners */
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    /* Light shadow */
    margin-bottom: 1.5rem;
    /* Space below jumbotron */
    display: flex;
    flex-direction: column;
}

.td-description {
    font-size: 20px;
    max-width: 80%;
    margin: 10px auto;
    /* Keep horizontal centering of the container */
    text-align: left;
    /* Left-justify the text */
}

.td-operator {
    font-size: 18px;
    max-width: 80%;
    margin: 10px auto;
    font-weight: 500;
}

.td-contact {
    font-size: 18px;
    max-width: 80%;
    margin: 20px auto 10px;
    font-style: italic;
}

/* Custom styling for lists in the content */
.td-description ul {
    display: block;
    /* Change from table to block display */
    text-align: left;
    padding-left: 2rem;
    /* Add some padding for list items */
}

.td-description h2 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    text-align: left;
    /* Left-justify headings */
}
</style>
