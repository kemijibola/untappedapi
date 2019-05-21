class SignInOptions {
    constructor(issuer, subject, type, audience, expiresIn, algorithm, keyid) {
        this.issuer = issuer;
        this.subject = subject;
        this.type = type;
        this.audience = audience;
        this.expiresIn = expiresIn;
        this.algorithm = algorithm;
        this.keyid = keyid
    }
}

module.exports = SignInOptions;