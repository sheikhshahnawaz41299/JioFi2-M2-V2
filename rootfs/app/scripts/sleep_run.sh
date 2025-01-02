#!/bin/sh

var_path=`cat /app/config/var.conf`

busybox echo app_lock > /sys/power/wake_lock

busybox echo 1 > ${var_path}/tmp/wifi_up_down
usleep 1350000

ifconfig wlan0 up

sleep 1s

ifconfig wlan0 down


busybox echo 0 > ${var_path}/tmp/wifi_up_down

busybox echo app_lock > /sys/power/wake_unlock

