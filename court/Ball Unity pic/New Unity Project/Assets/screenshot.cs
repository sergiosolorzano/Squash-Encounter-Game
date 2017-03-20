using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class screenshot : MonoBehaviour
{

    public void takesnapshot()
    {
        Application.CaptureScreenshot("Screenshot.png");
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            takesnapshot();
        }
    }
}

