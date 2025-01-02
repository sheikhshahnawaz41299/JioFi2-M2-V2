### Prerequisite
- [ubireader](https://github.com/onekey-sec/ubi_reader)
- mkfs.ubifs and ubinize (search, how to install it)


### Unpack

unpack system.oob
```bash
sudo ./ubireader_extract_images.py system.oob -o system_u
cd ./system_u/system.ubi/
```
Now you will get file with .ubifs

We need to modify "img-396211929_vol-rootfs.ubifs"

unpack ubifs
```bash
sudo ./ubireader_extract_files.py -k -w -o ./rootfs img-1620013534_vol-rootfs.ubifs
```

### Repack

repack .ubifs 
```bash
sudo /usr/sbin/mkfs.ubifs -m 4096 -e 253952 -c 261 -x lzo -f 8 -k r5 -p 1 -l 4 -r ./rootfs/ img-1620013534_0.ubifs
```

Repack to img
```bash
sudo /usr/sbin/ubinize -p 262144 -m 4096 -O 4096 -s 4096 -x 1 -Q 1620013534 -o System_test.img img-1620013534.ini
```
