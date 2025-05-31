const awsmobile = {
    // Core AWS Configuration
    aws_project_region: "us-east-2",
    aws_cognito_region: "us-east-2",
    
    // Cognito User Pool Configuration
    aws_user_pools_id: "us-east-2_wDaOsZVUK",
    aws_user_pools_web_client_id: "1pgp6sbivc245jaep01bchfsem",
    
    // Authentication Configuration
    aws_mandatory_sign_in: "enable",
    
    // Cognito Identity Pool (if you have one, otherwise leave empty)
    aws_cognito_identity_pool_id: "",
    
    // OAuth Configuration (empty if not using OAuth/Social Sign-in)
    oauth: {},
    
    // Auth Configuration for explicit settings
    Auth: {
        // Specify the AWS region
        region: "us-east-2",
        
        // Amazon Cognito User Pool ID
        userPoolId: "us-east-2_wDaOsZVUK",
        
        // Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: "1pgp6sbivc245jaep01bchfsem",
        
        // Amazon Cognito Identity Pool ID (if you have one)
        // identityPoolId: "IDENTITY_POOL_ID",
        
        // Set to true to use mandatory sign-in
        mandatorySignIn: true,
        
        // Authentication flow type
        authenticationFlowType: 'USER_SRP_AUTH',
        
        // Cookie storage domain for Hosted UI
        // cookieStorage: {
        //     domain: 'localhost',
        //     path: '/',
        //     expires: 365,
        //     sameSite: 'strict',
        //     secure: false
        // }
    },
    
    // API Configuration (if you have GraphQL/REST APIs)
    // aws_appsync_graphqlEndpoint: "",
    // aws_appsync_region: "us-east-2",
    // aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
    
    // Storage Configuration (if using S3)
    // Storage: {
    //     AWSS3: {
    //         bucket: "",
    //         region: "us-east-2"
    //     }
    // }
};

export default awsmobile;