using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EscapeToQuit : MonoBehaviour {
    public void quitGameNow() {
        Application.Quit();

    }
	void Update () {
        if(Input.GetKeyDown(KeyCode.Escape))
        {
            quitGameNow();
        }
	}
}
