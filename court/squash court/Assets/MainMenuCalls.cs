using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenuCalls : MonoBehaviour {
    
	public void GoToScene (string sceneToLoad) {
        SceneManager.LoadScene(sceneToLoad);
	}
	
}
