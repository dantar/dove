package it.dantar.cav.mvc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import it.dantar.cav.entities.Oggetto;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PicturesService {

	@Value("${pictures.root}")
	private String root;
	File rootDir;
	
	@PostConstruct
	public void postConstruct() {
		this.rootDir = new File(root);
		log.info("Pictures directory: {}", root);
		if (!this.rootDir.exists()) {
			throw new RuntimeException(String.format("Pictures directory %s does not exist", root));
		}
		if (!this.rootDir.isDirectory()) {
			throw new RuntimeException(String.format("Pictures directory %s is not a directory", root));
		}
		if (!this.rootDir.canWrite()) {
			throw new RuntimeException(String.format("Pictures directory %s is not accessible", root));
		}
	}

	public String savePicture(String uuid, String picture) throws IOException {
		File d = this.picturesDirectory(uuid);
		String b64 = picture.substring(23); // base64 url jpeg header
		String pictureId = UUID.randomUUID().toString();
		FileOutputStream fos = new FileOutputStream(new File(d, pictureId));
		byte[] decodedBytes = Base64.getDecoder().decode(b64);
		fos.write(decodedBytes);
		fos.close();
		return pictureId;
	}

	public List<String> allPictureUuids(String uuid) {
		File objectDir = picturesDirectory(uuid);
		return Arrays.asList(objectDir.listFiles())
				.stream()
				.map(f -> f.getName())
				.collect(Collectors.toList());
	}

	private File picturesDirectory(String uuid) {
		File objectDir = new File(this.rootDir, uuid);
		if (!objectDir.exists()) {
			objectDir.mkdirs();
		}
		return objectDir;
	}

	public void caricaImmagini(Oggetto oggetto) {
		oggetto.setImmagini(this.allPictureUuids(oggetto.getId()));
	}

	public List<Oggetto> caricaImmagini(List<Oggetto> oggetti) {
		oggetti.stream().forEach(oggetto -> this.caricaImmagini(oggetto));
		return oggetti;
	}

	public Boolean deletePicture(String uuid, String code) {
		File d = this.picturesDirectory(uuid);
		return new File(d, code).delete();
	}
	
}
