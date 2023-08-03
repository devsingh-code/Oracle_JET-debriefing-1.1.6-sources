#!/usr/bin/env bash

/usr/bin/env php -S localhost:49443 -t "./" &
PHP_PID=$!

grunt oraclejet-build:dev
mocha --ui tdd "test/test-index.js"
TEST_RESULT=$?

kill ${PHP_PID}
exit ${TEST_RESULT}