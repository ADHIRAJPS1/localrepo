import { NgxImageCompressService } from 'ngx-image-compress';
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Config } from "src/app/services/config";

@Component({
    selector: "multiple-file-upload",
    templateUrl: "./multiple-file-upload.component.html",
    styleUrls: ["./multiple-file-upload.component.css"],
})
export class MultipleFileUpload implements OnInit{

   @Input() requiredFileType: string;
    @Input() label: string;
    @Input() placeholderImg: string;
    @Output() fileSelected = new EventEmitter();
    @Output() onItemDeleted  = new EventEmitter();
    fileSrc: string | ArrayBuffer;
    file: any;
    localUrl: string | ArrayBuffer;
    localCompressedURl:any;
    sizeOfOriginalImage:number;
    sizeOFCompressedImage:number;
    imgResultBeforeCompress:string;
    imgResultAfterCompress:string;
    bs64Data :any;
    constructor(public config: Config, private imageCompress: NgxImageCompressService) {
    }

    ngOnInit() {
        if(this.placeholderImg && this.placeholderImg.length > 0) {
            this.localUrl = this.placeholderImg;
        }
    }
    removeAttachment() {
     this.localUrl = null;
    }


    handleInputChangeReport(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

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
               this.localUrl = reader.result;
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
                this.fileSelected.emit(file);
              //  console.log('bs64Data', this.bs64Data )
            });
            }

      }
            reader.readAsDataURL(e.target.files[0]);
        }
        else {
            this.fileSelected.emit(file);
        }
    }
}
