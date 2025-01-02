#!/bin/sh

export PATH=/app/bin:$PATH
export LD_LIBRARY_PATH=/app/lib:$LD_LIBRARY_PATH

data_path="/ww_data"
bata_path="/cache/databake/ww_data"
nv_path="/ww_data/nv"
mkdir ${data_path}


mtd_file=/proc/mtd

mtd_block_number=`cat $mtd_file | grep -i data | sed 's/^mtd//' | awk -F ':' '{print $1}'`

ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 3 -b 5
if [ $? -ne 0 ];then
	echo "data attach" >> /cache/fota/cut_broken
	touch /cache/databake/NEED_RESTORE_TO_DATA
	sync
	#ubiformat /dev/mtd$mtd_block_number
	/usr/sbin/flash_eraseall /dev/mtd$mtd_block_number
	ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 3 -b 5	
fi
ubimkvol /dev/ubi3 -s 4MiB -N data 

i=0
while [ 1 ]
do
	i=`expr $i + 1`
	if [ $i -eq 40 ];then
		echo "data mount" >> /cache/fota/cut_broken
		touch /cache/databake/NEED_RESTORE_TO_DATA
		sync
		ubidetach -m $mtd_block_number
		/usr/sbin/flash_eraseall /dev/mtd$mtd_block_number
		ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 3 -b 5
		ubimkvol /dev/ubi3 -s 4MiB -N data 
		mount -t ubifs -o sync /dev/ubi3_0 ${data_path}	
		break	
	fi

	if [ -c /dev/ubi3_0 ];then
		mount -t ubifs -o sync /dev/ubi3_0 ${data_path}
		if [ $? -eq 0 ];then
			break
		fi
	else
		ubimkvol /dev/ubi3 -s 4MiB -N data 
		sleep 0.010
	fi
done

ubi_err=/sys/class/ubi/errno
if [ ! -f /cache/databake/NEED_RESTORE_TO_DATA ];then
	ubi_err_number=`cat $ubi_err`
	if [ $ubi_err_number -eq 3 ];then
		echo "data other" >> /cache/fota/cut_broken
		touch /cache/databake/NEED_RESTORE_TO_DATA
		sync
		ubidetach -m $mtd_block_number
		/usr/sbin/flash_eraseall /dev/mtd$mtd_block_number
		ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 3 -b 5
		ubimkvol /dev/ubi3 -s 4MiB -N data
		sleep 1 
		mount -t ubifs -o sync /dev/ubi3_0 ${data_path}	
	fi
fi

CheckDataKeyFile (){
  file_miss=0
  ret=0
  wlan_addr_path="nv/hw_wlan_addr"
  gen_data_path="hw_gen_data"
  hw_wlan_path="hw_wlan"

  #check hw_gen_data
  if [ ! -f $data_path/$gen_data_path ];then
    if [ -f $bata_path/$gen_data_path ];then
      cp -f $bata_path/$gen_data_path $data_path/$gen_data_path
      file_miss=`expr $file_miss + 1`
    fi
  fi

  #check hw_wlan_addr
  if [ -f $data_path/$wlan_addr_path ];then
    cat $data_path/$wlan_addr_path | xargs echo | grep "64 64 64 64 64 64"
    ret=$?
  else
    ret=0;
  fi
  if [ $ret == 0 ];then
    cat $bata_path/$wlan_addr_path | xargs echo | grep "64 64 64 64 64 64"
    if [ $? != 0 ];then
      cp -f $bata_path/$wlan_addr_path $data_path/nv/
      mkdir -p $data_path/reserve_nv
      cp -f $bata_path/$wlan_addr_path $data_path/reserve_nv/
	  mkdir -p $bata_path/reserve_nv
      cp -f $bata_path/$wlan_addr_path $bata_path/reserve_nv/
      file_miss=`expr $file_miss + 2`
    fi
  fi
  return $file_miss
}

CheckDataKeyFile
if [ $? -gt 2 ]; then
	touch /cache/databake/NEED_RESTORE_TO_DATA
fi

if [ -f /cache/databake/NEED_RESTORE_TO_DATA ];then
	if [ -f $bata_path/hw_gen_data ];then
		rm -rf $data_path/*
		cp -rfp /cache/databake$data_path/*  $data_path/
		sync
		rm /cache/databake/NEED_RESTORE_TO_DATA
		touch /cache/databake/FILE_OK
		sync
		echo 1 > /proc/sys/vm/drop_caches
	fi
elif [ ! -f /cache/databake/FILE_OK ];then
	if [ -f $data_path/reserve_nv/hw_wlan_addr ];then
		mkdir -p /cache/databake
		rm -rf /cache/databake/*
		cp -rfp $data_path /cache/databake/
		sync
		touch /cache/databake/FILE_OK
		sync
		echo 1 > /proc/sys/vm/drop_caches
	fi	
fi

sed -i 's/255.255.255/255.255.0/g' /ww_data/nv/dhcp_mask

# restore hardware version
if [ -f /ww_data/hw_ver ];then
	hw_bak=`cat /ww_data/hw_ver`
	hw=`head -n 2 /app/config/wwv.cfg | tail -n 1`
	if [ "$hw_bak" != "$hw" ];then
		sed -i "2c$hw_bak" /app/config/wwv.cfg
	fi
fi

# set time zome
at_tools ven_set_time_zone
if [ -e /var/volatile/TZ ];then
       export TZ=`cat /var/volatile/TZ`
fi

#mkdir /webui
#mtd_block_number=`cat $mtd_file | grep -i webui | sed 's/^mtd//' | awk -F ':' '{print $1}'`
#ubiattach /dev/ubi_ctrl -m $mtd_block_number -d 4 -b 5
#mount -t ubifs /dev/ubi4_0 /webui

/app/scripts/usb_mode.sh

/app/scripts/upgrade.sh

var_path=`cat /app/config/var.conf`

mkdir ${var_path}
mkdir ${var_path}/run
mkdir ${var_path}/lib
mkdir ${var_path}/lib/misc/
mkdir ${var_path}/tmp
mkdir ${var_path}/boa
mkdir ${var_path}/modem
mkdir ${var_path}/modem/stat
mkdir ${var_path}/modem/time
mkdir ${var_path}/dnrd
mkdir ${var_path}/fota
mkdir ${var_path}/db
mkdir ${data_path}/property
mkdir ${data_path}/cwmp
mkdir ${var_path}/batt
mkdir ${var_path}/sysinfo
mkdir ${var_path}/config
mkdir /app/log/

#rm -rf /app/var
#ln -sf /var/volatile /app/var

busybox chmod a-x,go-w  ${var_path}/dnrd

mkdir /tmp

# ln -s /system/vendor/wewins/app /app
# ln -s /system/vendor/wewins/webui /webui
# ln -s /app/lib /lib
# ln -s /system/bin/busybox /app/bin/syslogd
# ln -s /system/bin/busybox /app/bin/klogd
#ln -s /bin/busybox /app/bin/syslogd
#ln -s /bin/busybox /app/bin/klogd

# chmod -R 0777 /system/vendor/wewins/app/bin
# chmod -R 0777 /system/vendor/wewins/app/lib
# chmod -R 0777 /system/vendor/wewins/app/scripts

# rm /system/bin/ifconfig
# busybox ln -s busybox /system/bin/ifconfig
# rm /system/bin/route
# busybox ln -s busybox /system/bin/route
# busybox ln -s busybox /system/bin/killall
# busybox ln -s busybox /system/bin/echo

rm -rf /etc/hosts
ln -sf ${var_path}/hosts /etc/hosts
rm -rf /etc/dnrd
ln -sf ${var_path}/dnrd /etc/dnrd
rm -rf /etc/resolv.conf
ln -sf ${var_path}/resolv.conf /etc/resolv.conf

busybox sysctl -w kernel.randomize_va_space=2

busybox echo 1 > /proc/sys/net/ipv4/ip_forward

busybox echo 1 > /proc/sys/net/ipv6/conf/all/forwarding

busybox echo 1,0 > ${var_path}/modem/time/phase
busybox echo 0 > ${var_path}/modem/time/phase_lock

busybox cp -rf ${nv_path}/stat_conntime  ${var_path}/modem/stat/backup_stat_conntime
busybox cp -rf ${nv_path}/stat_rxbytes   ${var_path}/modem/stat/backup_stat_rxbytes
busybox cp -rf ${nv_path}/stat_txbytes   ${var_path}/modem/stat/backup_stat_txbytes

#syslogd -L -s 32 -b 1 &
# start time services, must before boa
ww_time_daemon

# sleep 3
at &
ww_qmi_proxy &

# let modem works, but tx and rx circuits are turned off
at_test at+cfun=4

# uim status
/app/scripts/gen_uim_status.sh

# imsi
/app/scripts/gen_imsi.sh

# imei
/app/scripts/gen_imei.sh

#start app
ww_netctrlc start
wnet &
boa &
hf_server &

key_led&

#disable dload mode
echo 0 > /sys/module/msm_poweroff/parameters/download_mode 

insmod /lib/modules/rtl8192es.ko
#insmod /lib/modules/rtl8189es.ko

kernel_version=`uname -r | awk '{print $1}'`
insmod /lib/modules/$kernel_version/kernel/drivers/net/nf_conntrack_rtsp.ko
insmod /lib/modules/$kernel_version/kernel/drivers/net/nf_nat_rtsp.ko

sysconf init

echo 1 > ${var_path}/wifi_driver_st

volte_mal &
embms_mal &
patrol &

cwmpc -v 1 -D 0x1F &

klogd&
/app/scripts/extra_syslog.sh &

