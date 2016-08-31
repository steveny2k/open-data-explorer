#!/bin/bash

set -x
npm run build
npm run test-travis
