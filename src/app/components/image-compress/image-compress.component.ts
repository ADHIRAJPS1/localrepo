import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
selector: 'image-compress',
templateUrl: './image-compress.component.html',
styleUrls: ['./image-compress.component.css']
})
export class ImageCompressComponent implements OnInit {
  @Input() label: string;
  @Input() placeholderImg: string;
  @Output() fileSelected = new EventEmitter();
  @Input() requiredFileType: string;
  file: any;
  localUrl: string | ArrayBuffer;
  localCompressedURl:any;
  sizeOfOriginalImage:number;
  sizeOFCompressedImage:number;
  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;
  bs64Data :any;

  constructor(private imageCompress: NgxImageCompressService) { }
  ngOnInit() {
    if(this.placeholderImg && this.placeholderImg.length > 0) {
      this.localUrl = this.placeholderImg;
      //console.log(this.localUrl)
  }
  }
  handleInputChange(e: any) {
        var  file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];;
        if(this.requiredFileType.includes('image/*')) {
          var pattern = /image-*/;
          var reader = new FileReader();

          if (!file.type.match(pattern)) {
              alert('invalid format');
              return;
          }
          if (e.target.files && e.target.files[0]) {
          var reader = new FileReader();
          reader.onload = (e: any) => {
            var img = new Image();
            img.src = e.target.result;
             img.onload = function(): any {
             // console.log(img.width, "x", img.height);
              // var isUploaded = false;
              if (img.width != 600 && img.height != 600) {
               // console.log('Diamension Should Be 600x600.')
               /// console.log(img.src)
              }
            };
          var orientation = -1;
          this.imageCompress.compressFile(e.target.result, orientation, 50, 50).then(
            result => {
            this.imgResultAfterCompress = result;
            this.localCompressedURl = result;
            this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
            this.bs64Data = this.sizeOFCompressedImage;
           // let reader = this.sizeOFCompressedImage;
          //  this.bs64Data = reader.result;
            file['base64url'] = this.imgResultAfterCompress;
            this.localUrl = reader.result;
            file['base64url'] = this.localUrl;
            this.fileSelected.emit(file);
           // console.log('bs64Data', this.bs64Data )
        });
        }

  }
        reader.readAsDataURL(e.target.files[0]);
} else{
  this.fileSelected.emit(file);
}

}
   compressFile(image,fileName) {
      var orientation = -1;
      this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
     // console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
      this.imgResultAfterCompress = result;
      this.localCompressedURl = result;
      this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
      this.bs64Data = this.sizeOFCompressedImage;
      //console.log('bs64Data', this.bs64Data )
     // console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
      // create file from byte
      const imageName = fileName;
      // call method that creates a blob from dataUri
      const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
      //imageFile created below is the new compressed file which can be send to API in form data
      const imageFile = new File([result], imageName, { type: 'image/jpeg' });
});}
  dataURItoBlob(dataURI) {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
      }
  const blob = new Blob([int8Array], { type: 'image/jpeg' });
  return blob;
  }

}
