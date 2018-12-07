import os
from PIL import Image
from pathlib import Path
import json

folder = os.listdir("imgs/all")
folderPath = str(Path("imgs/all").resolve())
folderPath+="/"

path = "./"
data = {}
filename = "hitboxes"


def writeToJSONFile(path, fileName, data):
    filePathNameWExt = './' + path + '/' + fileName + '.json'
    with open(filePathNameWExt, 'w') as fp:
        json.dump(data, fp, indent=2)


for img in folder:
    im = Image.open(folderPath + img)
    # Convert our image to RGB
    rgb_im = im.convert('RGB')
    # Use the .size object to retrieve a tuple contain (width,height) of the image
    # and assign them to width and height variables
    width = rgb_im.size[0]
    height = rgb_im.size[1]
    # set some counters for current row and column and total pixels
    row = 1
    col = 1
    pix = 0

    minimal_x = None
    minimal_y = None
    maximal_x = None
    maximal_y = None
    # create an empty output row
    rowdata = ""
    # loop through each pixel in each row outputting RGB value as we go...
    # all the plus and minus ones are to deal with the .getpixel class being
    # zero indexed and we want the output to start at pixel 1,1 not 0,0!
    while row < height + 1:
        print("")
        print("Row number: " + str(row))
        while col < width + 1:
            # get the RGB values from the current pixel
            x = col - 1
            y = row - 1
            
            r, g, b = rgb_im.getpixel((x, y))
            if(r != 0 and g != 0 and b != 0):
                if(minimal_x == None or x < minimal_x):
                    minimal_x = x
                if(minimal_y == None or y < minimal_y):
                    minimal_y = y
                if(maximal_x == None or x > maximal_x):
                    maximal_x = x
                if(maximal_y == None or y > maximal_y):
                    maximal_y = y
            # append the RGB values to the rowdata variable as (R, G, B)
            rowdata += "(" + str(r) + "," + str(g) + "," + str(b) + ") "
            # increment the column count
            col = col + 1
            # increment the pixel count
            pix = pix + 1
        # print out all RGB values for the row
        print(rowdata)
        # clear out rowdata variable
        rowdata = ""
        # increment the row...
        row = row + 1
        # reset the column count
        col = 1
    #output for proof!
    print("")
    print("Width = " + str(width) + " pixels")
    print("Height = " + str(height) + " pixels")
    print("Total Pixels = " + str(pix) + ".")
    print(minimal_x - 1, minimal_y - 1, maximal_x + 2, maximal_y + 2)
    data[img] = {
        'hitbox.x': (minimal_x - 1)/width,
        'hitbox.y': (minimal_y - 1)/width,
        'hitbox.width': (maximal_x + 2)/height,
        'hitbox.height': (maximal_y + 2)/height
    }
    writeToJSONFile(path, filename, data)

