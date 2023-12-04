interface AuthConfig {
    client_id: string;
    client_secret: string;
    redirect_uri: string;

}

interface AppConfig {
    domain: string;
    auth: AuthConfig;
}

const config: AppConfig = {
    domain: 'imranmmnv',
    auth: {
        client_id: '4e3b4af5-5957-42ea-90a9-a7bb6fec43bd',
        client_secret: 'mpnzMFVVUp6pmZsjS7wC1JpHAt49gneyGCVNBZEMFvZBRrkdS4TxaenDjDf4bL22',
        redirect_uri: 'https://localhost',
    }
};

export default config;
