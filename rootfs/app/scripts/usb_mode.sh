#!/bin/sh

num="0"
usb_open_diag=/ww_data/nv/usb_open_diag
sd_mode=/ww_data/nv/sd_mode
nv_version=/ww_data/nv/version
usb_diag_mode=`cat $usb_open_diag`
usb_sd_mode=`cat $sd_mode`

if [ ! -f "$nv_version" ];then
	usb_diag_mode=1
	echo 1 > /ww_data/nv/open_adbd
fi

echo 0 > /sys/class/android_usb/android$num/enable

echo F000 > /sys/class/android_usb/android$num/pid_cdrom
echo F00E > /sys/class/android_usb/android$num/pid_rndis
echo 902D > /sys/class/android_usb/android$num/pid_rndisdiagadb
echo 05C6 > /sys/class/android_usb/android$num/idVendor
echo Qualcomm > /sys/class/android_usb/android$num/iManufacturer 
echo Mobile Router > /sys/class/android_usb/android$num/iProduct 
echo Mobile > /sys/class/android_usb/android$num/storage_cd_vendor         
echo Router CD-ROM > /sys/class/android_usb/android$num/storage_cd_product
echo Mobile > /sys/class/android_usb/android$num/storage_sd_vendor         
echo Router USB-Stor > /sys/class/android_usb/android$num/storage_sd_product
echo fc:de:56:ff:01:06 > /sys/class/android_usb/android$num/f_rndis/ethaddr
echo diag > /sys/class/android_usb/android0/f_diag/clients
echo smd > /sys/class/android_usb/android0/f_serial/transports
echo QTI,BAM_DMUX > /sys/class/android_usb/android0/f_rmnet/transports
echo 1 > /sys/class/android_usb/android$num/f_rndis/wceis
echo 1 > /sys/class/android_usb/android$num/remote_wakeup
echo F000 > /sys/class/android_usb/android$num/idProduct
echo mass_storage > /sys/class/android_usb/android$num/functions

if [ 1 -eq $usb_diag_mode ];then
	echo "rndis+diag+adb+modem mode"
	echo 1 > /sys/class/android_usb/android$num/open_diagadb
else
	echo "rndis mode"
	echo 0 > /sys/class/android_usb/android$num/open_diagadb
fi

if [ 0 -eq $usb_sd_mode ];then
	# umount sdcard
	mountpoint /media/card
	if [ 0 -eq $? ];then
		busybox umount /media/card
	fi

	echo 1 > /sys/class/android_usb/android$num/sdcard_enable
	echo /dev/mmcblk0p1 > /sys/class/android_usb/android$num/sdcard_filename
else
	echo 0 > /sys/class/android_usb/android$num/sdcard_enable
fi

echo 1 > /sys/devices/virtual/android_usb/android0/enable
# switch diag without reboot
killall -9 adbd
if [ 1 -eq $usb_diag_mode ];then
/etc/init.d/adbd start
fi

