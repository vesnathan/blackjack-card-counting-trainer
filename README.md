# Black Jack Advantage Play Trainer

## CONTENTS

[1. DESCRIPTION](#DESCRIPTION)

[2. SCREENSHOTS](#SCREENSHOTS)

[3. INSTALLATION](#INSTALLATION)

[4. USAGE](#USAGE)

[5. TECHNOLOGIES USED](#TECHNOLOGIESUSED)

[6. CONTRIBUTE](#CONTRIBUTE)

[7. TESTS](#TESTS)

[8. LICENCE](#LICENCE)

[9. LINKS](#LINKS)

<a id="DESCRIPTION"></a>

## DESCRIPTION

Practice your card counting and basic strategy skills with this training app.

<a id="SCREENSHOTS"></a>

## SCREENSHOTS

![](./client/src/assets/images/screenshots/Capture.PNG)"

![](./client/src/assets/images/screenshots/Capture2.PNG)"

![](./client/src/assets/images/screenshots/Capture3.PNG)"

<a id="INSTALLATION"></a>

## INSTALLATION

    In your projects folder, run the following commands:
        git clone https://github.com/vesnathan/blackjack-card-counting-trainer
        cd blackjack-card-counting-trainer

    Create a file called .env in the project root, and set the following vars.
    Make sure to swap the Stripe keys for your own.

    NODE_ENV="development"
    SERVER_PORT=3002
    DB_NAME="bjcct"
    DB_PORT=27017
    DB_HOST="localhost"
    MONGODB_URI="mongodb://localhost/bjcct"
    STRIPE_PK="XXX"
    STRIPE_SK="XXX"
    STRIPE_PK_TEST="XXX"
    STRIPE_SK_TEST="XXX"

    Run the following command in the root directory:
        "yarn"

     Run the following command in the client directory:
        "yarn"

    Run the following command in the backend directory:
        "yarn"

    Install and start MongoDB Community Server

<a id="USAGE"></a>

## USAGE

    Run the following command from the root:
        "yarn deploy:dev"

    Go to localhost:3002 to view running app

<a id="TECHNOLOGIESUSED"></a>

## TECHNOLOGIES USED

React  
TypeScript  
Sass - SCSS  
Apollo/GraphQL  
MongoDB/Mongoose  
MaterialUI  
Styled Components  
ESLint - Air BnB  
Husky  
bcrypt  
JSON Web Token  
PWA  
Stripe Elements

<a id="CONTRIBUTE"></a>

## CONTRIBUTE

    No contributions accepted

<a id="TESTS"></a>

## TESTS

    No tests created

<a id="LICENCE"></a>

## LICENCE

    This software is copyright and is not to be used in
    any way shape or form unless written authorisation is
    obtained from it's developer.

<a id="LINKS"></a>

## LINKS

[GITHUB](https://github.com/vesnathan/blackjack-card-counting-trainer) <br>
[HEROKU](https://bjcct.herokuapp.com/) <br>
