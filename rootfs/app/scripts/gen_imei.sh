#!/bin/sh

var_path=`cat /app/config/var.conf`

# imei
imei=`at_test ATI | busybox grep IMEI | busybox cut -c 7-21 | busybox tr -d "\n\r"`
if [ -n "$imei" ];then
  busybox echo -n $imei > ${var_path}/modem/imei
else
  busybox rm -rf ${var_path}/modem/imei
fi

