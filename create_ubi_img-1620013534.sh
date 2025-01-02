#!/bin/sh
/usr/sbin/mkfs.ubifs -m 4096 -e 253952 -c 261 -x lzo -f 8 -k r5 -p 1 -l 4 -r $1 img-1620013534_0.ubifs
/usr/sbin/mkfs.ubifs -m 4096 -e 253952 -c 2146 -x lzo -f 8 -k r5 -p 1 -l 4 -r $2 img-1620013534_1.ubifs
/usr/sbin/ubinize -p 262144 -m 4096 -O 4096 -s 4096 -x 1 -Q 1620013534 -o img-1620013534.ubi img-1620013534.ini
