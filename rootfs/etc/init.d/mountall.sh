#!/bin/sh
### BEGIN INIT INFO
# Provides:          mountall
# Required-Start:    mountvirtfs
# Required-Stop: 
# Default-Start:     S
# Default-Stop:
# Short-Description: Mount all filesystems.
# Description:
### END INIT INFO

. /etc/default/rcS

#
# Mount local filesystems in /etc/fstab. For some reason, people
# might want to mount "proc" several times, and mount -v complains
# about this. So we mount "proc" filesystems without -v.
#
test "$VERBOSE" != no && echo "Mounting local filesystems..."
mount -at nonfs,nosmbfs,noncpfs 2>/dev/null

#
# We might have mounted something over /dev, see if /dev/initctl is there.
#
if test ! -p /dev/initctl
then
	rm -f /dev/initctl
	mknod -m 600 /dev/initctl p
fi
kill -USR1 1

#
# Execute swapon command again, in case we want to swap to
# a file on a now mounted filesystem.
#
swapon -a 2> /dev/null


#wewins
FindAndMountVolumeUBI () {
   volume_name=$1
   dir=$2
   if [ ! -d $dir ]
   then
       mkdir -p $dir
   fi
   mount -t ubifs ubi0:$volume_name $dir -o bulk_read
}

RepairSystem()
{
	echo "sys_attach" >> /cache/fota/cut_broken
	#/usr/sbin/ubiformat /dev/mtd$1
	/usr/sbin/flash_eraseall /dev/mtd$1
	if [ $? -ne 0 ]; then
		return 1
	fi

	/usr/sbin/ubiattach /dev/ubi_ctrl -d 6 -m $1
	if [ $? -ne 0 ]; then
		return 1
	fi
	sleep 0.5

	/usr/sbin/ubimkvol -s 63MiB -N rootfs /dev/ubi6
	if [ $? -ne 0 ]; then
		return 1
	fi
	sleep 0.1

	/usr/sbin/ubimkvol -m -N usrfs /dev/ubi6
	if [ $? -ne 0 ]; then
		return 1
	fi
	sleep 0.1

	mkdir /system_bake
	mount -t ubifs -o sync /dev/ubi6_0 /system_bake
	if [ $? -ne 0 ]; then
		return 1
	fi

	rm -rf /system_bake/*
	
	find / -mindepth 1 -maxdepth 1 ! -name proc ! -name sys ! -name dev ! -name run ! -name var ! -name media ! -name data ! -name cache ! -name firmware ! -name ww_data ! -name mdem_bake ! -name system_bake -exec cp -rfp {} /system_bake \;
	mkdir /system_bake/proc
	mkdir /system_bake/sys
	mkdir /system_bake/dev
	mkdir /system_bake/run
	mkdir -p /system_bake/var/volatile
	mkdir -p /system_bake/media/ram
	mkdir -p /system_bake/media/card
	
	find /var -mindepth 1 -maxdepth 1 ! -name volatile -exec cp -rfp {} /system_bake/var \;
	find /media -mindepth 1 -maxdepth 1 ! -name ram ! -name card -exec cp -rfp {} /system_bake/media \;
	cp -rfp /run/* /system_bake/run
	cp -rfp /dev/* /system_bake/dev

	umount /system_bake
	/usr/sbin/ubidetach -m $1 

	sync
	echo 1 > /proc/sys/vm/drop_caches
}
ActionForCheck()
{
	OTA_STRING=`/app/bin/ota_pioneer -k`
	TAR_SYSTEM=${OTA_STRING:1:1}
	
	TAR_NOW_SYSTEM=0
	ret=`/usr/sbin/ubiattach /dev/ubi_ctrl -m 13 2>&1`
	
	if [ $? -eq 0 ];then
		TAR_NOW_SYSTEM=1
		/usr/sbin/ubidetach -m 13
	else
		ret=`echo $ret | grep "error 17 (File exists)"`
		if [ -n "$ret" ];then      
			#echo "ro is attached" 
			TAR_NOW_SYSTEM=0
		else                       
			TAR_NOW_SYSTEM=1
			TAR_SYSTEM=B
			/app/bin/ota_pioneer -j 1B${OTA_STRING:2:1}
		fi 
	fi
		

	
	

	if [ $TAR_SYSTEM = A ];then
		if [ $TAR_NOW_SYSTEM -eq 0 ];then
			RepairSystem 14
			if [ $? -eq 0 ];then
				/app/bin/ota_pioneer -j 00${OTA_STRING:2:1}
			fi
		fi
	elif [ $TAR_SYSTEM = B ];then
		if [ $TAR_NOW_SYSTEM -eq 1 ];then
			RepairSystem 13
			if [ $? -eq 0 ];then
				/app/bin/ota_pioneer -j 11${OTA_STRING:2:1}
			fi
		fi
	elif [ $TAR_SYSTEM = 1 ];then
		if [ $TAR_NOW_SYSTEM -eq 0 ];then
			/app/bin/ota_pioneer -j 0A${OTA_STRING:2:1}
			RepairSystem 14
			if [ $? -eq 0 ];then
				/app/bin/ota_pioneer -j 00${OTA_STRING:2:1}
			fi
		fi
	else 	
		if [ $TAR_NOW_SYSTEM -eq 1 ];then
			/app/bin/ota_pioneer -j 1B${OTA_STRING:2:1}
			RepairSystem 13
			if [ $? -eq 0 ];then
				/app/bin/ota_pioneer -j 11${OTA_STRING:2:1}
			fi
		fi
	fi

}
ActionForOTA()
{
	mkdir /cache
#cachfs_id=`ubinfo /dev/ubi0 -N cachefs | grep -i volume | sed 's/^Volume ID:   //' | awk -F ' ' '{print $1}'`
	
	mtd_file=/proc/mtd
	mtd_block_number=`cat $mtd_file | grep -i cache | sed 's/^mtd//' | awk -F ':' '{print $1}'`

	/usr/sbin/ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 7 -b 5
	if [ $? -ne 0 ];then
		#echo "cache attach" >> /cache/fota/cut_broken
		/usr/sbin/flash_eraseall /dev/mtd$mtd_block_number
		/usr/sbin/ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 7 -b 5
	fi

	/usr/sbin/ubimkvol /dev/ubi7 -m -N cachefs
	
	i=0
	while [ 1 ]
	do
		i=`expr $i + 1`
		if [ $i -eq 40 ];then
			/usr/sbin/ubidetach -m $mtd_block_number
			/usr/sbin/flash_eraseall /dev/mtd$mtd_block_number
			/usr/sbin/ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 7 -b 5
			/usr/sbin/ubimkvol /dev/ubi7 -m -N cachefs
			mount -t ubifs /dev/ubi7_0 /cache
			break
		fi
	
		if [ -c /dev/ubi7_0 ];then
			#mount -t ubifs -o sync /dev/ubi3_0 ${data_path}
			mount -t ubifs /dev/ubi7_0 /cache
			if [ $? -eq 0 ];then
				break
			fi
		else
			/usr/sbin/ubimkvol /dev/ubi7 -m -N cachefs
			sleep 0.010
		fi
	done


	if [ -f /cache/recovery/install_next_boot.sh ]; then
		mkdir /cache/log
		chmod +x /cache/recovery/install_next_boot.sh
		/cache/recovery/install_next_boot.sh > /cache/log/install_next_boot.log 2>&1
		rm /cache/recovery/install_next_boot.sh
	fi

	if [ -f /cache/recovery/install_clean.sh ]; then
		chmod +x /cache/recovery/install_clean.sh
		/cache/recovery/install_clean.sh > /cache/log/install_clean.log 2>&1
		rm /cache/recovery/install_clean.sh
	fi
}



mtd_file=/proc/mtd

fstype="UBI"
eval FindAndMountVolume${fstype} usrfs /data

ActionForOTA
ActionForCheck

: exit 0

