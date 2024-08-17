const audioFileInput=document.getElementById('audioFile');
const imageFileInput=document.getElementById('imageFile');
const processButton=document.getElementById('process');
const audioResult=document.getElementById('audioResult');
const imageResult=document.getElementById('imageResult');

processButton.addEventListener('click',()=>{
const reader= new FileReader();
reader.onload=(e)=>{
const audioData=e.target.result;
//Actual processing logic
const audioResultText='Audio file classified as : ';
audioResult.textContent=audioResultText;
};
reader.readAsDataURL(audioFile);
}

if(imageFile){
const reader=new FileReader();
reader.onload=(e)=>{
const imageData=e.target.result;
//image processing logic
const imageResultText='Image classified as : ';
imageResult.textContent=imageResultText;
};
reader.readAsDataURL(imageFile);
}
});
