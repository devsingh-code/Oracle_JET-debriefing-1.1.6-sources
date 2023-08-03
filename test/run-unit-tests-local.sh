#!/usr/bin/env bash

S=`realpath "${BASH_SOURCE}" | xargs dirname`

mkdir .tmp-firefox-profile

grunt oraclejet-build:dev
karma start "${S}/karma.conf.js"
TEST_RESULT=$?

rm -rf .tmp-firefox-profile

exit ${TEST_RESULT}