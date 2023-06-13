const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = async (req, res) => {
  try {
    const [albumsList] = await db.query('SELECT * FROM albums');
    res.json(albumsList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from database');
  }
};

const getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [oneAlbum] = await db.query('SELECT * FROM albums WHERE ID = ?', [
      id,
    ]);
    if (oneAlbum[0] != null) {
      res.json(oneAlbum);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from database');
  }
};

const getTracksByAlbumId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [tracksPerAlbums] = await db.query(
      'SELECT * FROM albums JOIN track ON track.id_album = albums.id WHERE albums.id = ?;',
      [id]
    );
    if (tracksPerAlbums[0] != null) {
      res.json(tracksPerAlbums);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data from database');
  }
};

const postAlbums = async (req, res) => {
  try {
    const { title, genre, picture, artist } = req.body;
    const [albumToSend] = await db.query(
      'INSERT INTO albums(title, genre, picture, artist) VALUES (?, ?, ?, ?)',
      [title, genre, picture, artist]
    );
    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      album: albumToSend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the album',
    });
  }
};

const updateAlbums = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, genre, picture, artist } = req.body;
    const updateOneAlbum = await db.query(
      'UPDATE albums SET title = ?, genre = ?, picture = ?, artist = ? WHERE id = ?',
      [title, genre, picture, artist, id]
    );
    if (updateOneAlbum !== 0) {
      res.status(200).json({
        success: true,
        message: 'Album updated successfully',
        album: updateOneAlbum,
      });
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the album',
    });
  }
};

const deleteAlbums = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleteOneAlbum = await db.query('DELETE FROM albums WHERE id = ?', [
      id,
    ]);
    if (deleteOneAlbum[0] != 0) {
      res.status(200).json({
        success: true,
        message: 'Album deleted successfully',
        album: deleteOneAlbum,
      });
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the album',
    });
  }
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
