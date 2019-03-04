
import {isEmpty} from 'ramda'

function getAtlasAsset({id, file}) {

  const fileName = isEmpty(file) ? file : `${id}.png`;

  const resName = `${this.$resKey}@${utils.StringUtil.getFileName(fileName)}`

    let res = utils.AssetLoader.resourcesPool[resName];

    if (!res) {
      throw new Error(

      );
    }



    item.texture = res.texture;
    if (!item.texture) {
      res = utils.AssetLoader.resourcesPool[`${this.$resKey}@${fileName.replace("\.", "_")}`];
      item.texture = res.texture;
    }
}

function getAsset(packageItem) {

  {
    'image', 'swf', 'movieclip', 'sound', 'component', 'font', 'atlas',
  }

}
