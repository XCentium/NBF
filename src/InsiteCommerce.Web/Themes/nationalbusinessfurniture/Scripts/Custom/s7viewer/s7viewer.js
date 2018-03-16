function scene7InitWith(imageName) {
    imageID = 'NationalBusinessFurniture/' + imageName + '?wid=600';
    var flyoutViewer = new s7viewers.FlyoutViewer();
    {
        flyoutViewer.setContainerId("s7flyout_inline_div");
        flyoutViewer.setParam("asset", imageID);
        flyoutViewer.setParam("serverurl", "https://s7d9.scene7.com/is/image/");
        flyoutViewer.setParam("contenturl", "https://s7d9.scene7.com/skins/");
        flyoutViewer.setParam("autoResize", "1");
        flyoutViewer.setParam("overlay", "1");
        flyoutViewer.setParam("config", "Viewers/HTML5_Inline_FlyoutZoom");

        flyoutViewer.init();
        flyoutViewer.setAsset(imageID);
    }
}

function setVideo2(vURL) {
    // used to display videos

    $('#s7flyout_inline_div').hide();
    $('#videofile').show();
    $('#Wrapper360').hide();
    $('#mobile_div_container').hide();
    var myVideo = document.getElementById("videofile");
    myVideo.setAttribute("src", "https://s7d9.scene7.com/is/content/NationalBusinessFurniture/" + vURL);
    myVideo.play();

}

function set360(imageName, lanes, frames) {
    // used for 360 viewer
    var myVideo = document.getElementById("videofile");
    if (myVideo) {
        myVideo.pause();
    }
    
    var height = $('#s7flyout_inline_div').height();
    var width = height;
    var spriteSpin = document.getElementById("spritespin");
    if (spriteSpin.children.length == 0) {
        $('#spritespin').spritespin({
            source: SpriteSpin.sourceArray('https://s7d9.scene7.com/is/image/NationalBusinessFurniture/' + imageName + '2%5Fspin%5F{lane}{frame}s2?w=300', { lane: [1, lanes], frame: [1, frames], digits: 2 }),
            width: width,
            height: height,
            frames: frames,
            lanes: lanes,
            sense: -2,
            senseLane: -2,
            renderer: 'background',
            behavior: 'move',
            frameTime: 250,
        });
    }
    
    $('#s7flyout_inline_div').hide();
    $('#defaultimage').hide();
    $('#360file').show();
    $('#videofile').hide();
    $('#Wrapper360').show();
    $('#overlaych1').hide();
    $('#mobile_div_container').hide();
}
