class DisplayObject{
	constructor(x,y,height,width,direction,offsetX,offsetY,spriteHeight,spriteWidth){

		this.img = getImage(direction);
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.spriteHeight = spriteHeight;
		this.spriteWidth = spriteWidth;
	}
}

function getImage(direction){
	var img;
	if(direction == 0){
		img = front;
	} else if(direction == 1){
		img = left;
	} else if(direction == 2){
		img = back;
	} else if(direction == 3){
		img = right;
	} else if(direction == 4){
		img = map;
	}
	return img;
}