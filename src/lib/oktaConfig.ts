
// Sign in page only works for either localhost with http format or public website with https format
// since it is a single web page set up on okta, the PKCE flow is automatically turned on and there is no way to get around.
// And PKCE flow requires website to be exposed to an SSL port
// hence, the page hosted on S3 bucket has to use cloud front
// resource: https://devforum.okta.com/t/okta-login-widget-is-stuck-in-login/19489

export const oktaConfig = {
    clientId: '0oaaadpuebaQRCcNl5d7',
    issuer: 'https://dev-27935582.okta.com/oauth2/default',
    redirectUri:'http://localhost:3000/login/callback',
    scopes:['openid', 'profile', 'email'],
    pkce:true,
    disableHttpCheck:true,
}