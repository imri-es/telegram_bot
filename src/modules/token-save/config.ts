interface AuthConfig {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    code: string;
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
        code: 'def50200063946e993661e2c3cc4537dab8f75485ed964f9504b68c97433015f3e8735f7cdb86694fbc6a7050b51e55994aafc5f02de581d0a1fbd058cc1c6bc2222a6c82598f8f8df714aa7ab5eb7452a14f93af344c4a7447e27ff2ee4ad877f78348bfea6db9bdb5cbb0b777ca3333749ab4536e066354dacc784707cd23d23fa0681241b619e725aff7507a709615fd0953686ff0ae0c0611d648695a4ea95446ed524662b65fb645245166f5aa4d09955926532bba36c4309065f28934b1112e3ef6ecf54bcea35e917b748aacb6c2542120ce4f76e6679bf1e2b76b6612adf68c3e7a6890ff327a57202b84d74b668455114be1039d3c411a6650df2476182447619d6bc21d942af8b868615eeb21b87dc90382575d0b60d2f7e2fcf04de3916311b0d2fcc00aaee244d0fa8f921948f382b34025a0e31ab3df08cb632393442eedb3fa4673ace34ba2a6663615f38e996f6dd64aec0824a694aeb674c29e72229f2b4c54418f28d1645c2c013064bd2a471bdcf66d8e9b6ebefe120b8e56c42e6c3a17506fa3106027edb2ad43a1452db0bb58744c77792b6a83843b5639f4ba6cc837ad4a39cb298ed6799903806c320a3821bd8943566d80929516d47d9464894505be16f7847bcbd10ab9d959806d83d197000e6c1451f44b49792f69f' // Assuming this is intentionally left as a space
    }
};

export default config;
