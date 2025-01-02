#!/bin/sh

if [ -z $1 ];then
    echo "Usage: set_storage_mode.sh [mode]"
    echo "         0     -- local storage mode"
    echo "         non-0 -- non-local storage mode"
    exit 1
fi

# local storage mode
if [ 0 -eq $1 ];then
    echo "local storage mode"

    # umount sdcard
    mountpoint /media/card
    if [ 0 -eq $? ];then
        busybox umount /media/card
    fi

    # disable usb
    echo 0 > /sys/devices/virtual/android_usb/android0/enable

    # set scard filename
    echo "/dev/mmcblk0p1" > /sys/devices/virtual/android_usb/android0/sdcard_filename

    # enable sdcard
    echo 1 > /sys/devices/virtual/android_usb/android0/sdcard_enable

    # enable usb
    echo 1 > /sys/devices/virtual/android_usb/android0/enable
else
    echo "non-local storage mode"

    # umount sdcard
    mountpoint /media/card
    if [ 1 -eq $? ];then
        busybox mount -o sync /dev/mmcblk0p1 /media/card
    fi

    # disable usb
    echo 0 > /sys/devices/virtual/android_usb/android0/enable

    # set scard filename
    echo "" > /sys/devices/virtual/android_usb/android0/sdcard_filename

    # enable sdcard
    echo 0 > /sys/devices/virtual/android_usb/android0/sdcard_enable

    # enable usb
    echo 1 > /sys/devices/virtual/android_usb/android0/enable
fi
