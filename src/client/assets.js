const ASSET_NAMES = ['bullet.svg', 'ship.svg']

const assets = {}

const downloadAsset = (assetName) => {
	return new Promise((resolve, reject) => {
		const asset = new Image()
		asset.src = `/assets/${assetName}`
		asset.addEventListener('load', () => {
			console.log('Downloaded ', assetName)
			assets[assetName] = asset
			resolve()
		})
	})
}

export const downloadAssets = () => Promise.all(ASSET_NAMES.map(downloadAsset))

export const getAsset = (assetName) => assets[assetName]
