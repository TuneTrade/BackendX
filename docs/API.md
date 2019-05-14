#BackendX API

### GET /tokenInformation
Result:
    - `address`: TXT address.
    - `decimals`: TXT decimals.
    - `totalSupply`: TXT total supply.
    - `holders`: Amount of people holding tokens.

### GET /balance
Arguments:
    - `address`: Address to get the balance of.

Result:
    - `balance`: Balance in the lowest denomination.

### GET /creators
Result:
    List of creators.

### GET /creatorInformation
Arguments:
    - `address`: Address of the Creator Contract.

Result:
    - `creator`: Creator.
    - `description`: Creator's description.
    - `website`: Creator's website.
    - `type`: Creator type.
    - `fields`: {
        `?`: ?
    }
    - `owner`: Ethereum address which created the token.
    - `name`: Token name.
    - `Symbol`: Token symbol.
    - `decimals`: Token's decimals.
    - `totalSupply`: Total amount of tokens.
    - `creationTime`: Time of creation.
    - `crowdsale`: Address of the token's Crowdsale Contract.

### GET /tokenBalance
Arguments:
    - `address`: Address to get the balance of.

Result:
    - `balance`: Balance in the lowest denomination.

### GET /crowdsaleInformation
Arguments:
    - `address`: Address of the Crowdsale Contratc.

Result:
    - `tokens`: Amount of tokens to sell.
    - `sold`: Tokens sold.
    - `rate`: Tokens per wei.
    - `phase`: 0, 1, or 2.
    - `bonus`: % bonus for this phase.
    - `open`: true or false.

### GET /picture
Arguments:
    - `address`: Creator Contract.

Result:
    Image with a MIME type of "image".

### POST /uploadPicture
Arguments:
- `address`: Creator Contract.
- `picture`: Picture.
- `signature`: Signature of the SHA2-512 hash of the image signed by the owner of the Creator Contract.

Result:
    - `success`: Boolean status.
