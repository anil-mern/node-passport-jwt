let save = async(modal) => {
    try {
        let save = await modal.save();
        return save;
    } catch (err) {
        return err;
    }
}

module.exports.save = save;