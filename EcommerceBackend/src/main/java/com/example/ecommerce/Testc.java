package com.example.ecommerce;

import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.ArrayList;
import java.util.List;

public class Testc {

    public static void main(String[] args){

        List<Integer> data = new ArrayList<>();
        data.add(12);
        data.add(14);
        data.add(11);
        data.add(12);
        data.add(14);
        List<Integer> dis = new ArrayList<>();
        dis.add(11);
        dis.add(12);
        dis.add(13);

        for (Integer uu : data){
            if (!(dis.contains(uu))){
                System.out.println(uu);
            }
        }
        System.out.println(dis);
    }
}
