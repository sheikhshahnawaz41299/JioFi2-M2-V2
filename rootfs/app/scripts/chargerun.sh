#!/bin/sh

var_path=`cat /app/config${var_path}.conf`

mkdir ${var_path}
mkdir ${var_path}/run
mkdir ${var_path}/lib
mkdir ${var_path}/lib/misc/
mkdir ${var_path}/tmp

mkdir ${var_path}/batt
mkdir /system/log/


#ln -s /system/vendor/wewins/app /app
#ln -s /app/lib /lib
#ln -s /system/bin/busybox /app/bin/syslogd
#ln -s /system/bin/busybox /app/bin/klogd

#chmod -R 0777 /system/vendor/wewins/app/bin
#chmod -R 0777 /system/vendor/wewins/app/lib
#chmod -R 0777 /system/vendor/wewins/app/scripts

#busybox ln -s busybox /system/bin/echo


syslogd -L -s 32 -b 1 &


#start ww_bms 
#start ww_charge 

klogd&


